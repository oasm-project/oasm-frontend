import { resultsCreate, resultsGetAll, submissionsCreate, submissionsGetAll, submissionsGetOne } from "@/api";
import { IAssignment } from "@/types/assignment";
import { IUser } from "@/types/user";
import { AxiosError } from "axios";
import { format } from "date-fns";
import React from "react";
import { useForm } from "react-hook-form";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import Button from "../Button";
import FileInput from "../FileInput";
import Modal, { ModalHandle } from "../Modal";
import { useCSVDownloader, usePapaParse } from "react-papaparse";
import { ISubmission } from "@/types/submission";
import { IResult } from "@/types/result";

interface Props {
    assignment: IAssignment;
    user: IUser;
}

type FormValues = {
    attachment: File | null;
};

const AssignmentPreview: React.FC<Props> = ({ assignment, user }) => {
    const modalRef = React.useRef<ModalHandle>(null);
    const [loading, setLoading] = React.useState(false);

    const handleOpenModal = () => {
        modalRef.current?.open();
    };

    const {
        handleSubmit,
        control,
        formState: { errors, isDirty, isValid },
        reset,
        setError
    } = useForm<FormValues>({
        mode: "onChange"
    });

    const onSubmit = async (data: FormValues) => {
        var formData = new FormData();
        formData.append("attachment", data.attachment as File, data.attachment?.name);
        formData.append("assignment", assignment._id);

        setLoading(true);
        try {
            const response = await submissionsCreate(formData);
            if (response.data.success) {
                modalRef.current?.close();
                reset();
            }
        } catch (error: AxiosError | any) {
            if (error.response?.status === 400) {
                setError("root", {
                    type: "manual",
                    message: error.response.data.message || "Something went wrong"
                });

                console.error(error.response.data);
            } else {
                setError("root", {
                    type: "manual",
                    message: "Something went wrong"
                });
            }

            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const canSubmit = React.useMemo(() => {
        if (user.role === "student") {
            const submission = assignment.submissions.find((submission) => submission === user._id);
            const dueDate = new Date(assignment.dueDate);
            return !submission && dueDate > new Date();
        }

        return false;
    }, [assignment, user]);

    const { CSVDownloader, Type } = useCSVDownloader();

    const getCSVData = React.useCallback(async () => {
        if (user.role !== "lecturer") return [];

        const submissions = (await (await submissionsGetAll(`assignment=${assignment._id}`)).data.data.submissions) as ISubmission[];

        const csvData = submissions.map((submission, index) => ({
            "S/N": index + 1,
            NAME: submission.user.name,
            "MATRIC NO.": submission.user.matric,
            ANSWER: `${process.env.BACKEND_BASE_URL}/${submission.attachment}`,
            SCORE: ""
        }));

        return csvData;
    }, [assignment, user]);

    const [csvData, setCsvData] = React.useState<any[]>([]);

    React.useEffect(() => {
        getCSVData().then((data) => setCsvData(data));
    }, [getCSVData]);

    const releaseResultModalRef = React.useRef<ModalHandle>(null);
    const [loadingReleaseResult, setLoadingReleaseResult] = React.useState(false);

    const handleOpenReleaseResultModal = () => {
        releaseResultModalRef.current?.open();
    };

    const {
        handleSubmit: handleSubmitReleaseResult,
        control: controlReleaseResult,
        formState: { errors: errorsReleaseResult, isDirty: isDirtyReleaseResult, isValid: isValidReleaseResult },
        reset: resetReleaseResult
    } = useForm<FormValues>({ mode: "onChange" });

    const onSubmitReleaseResult = async (data: FormValues) => {
        var formData = new FormData();
        formData.append("attachment", data.attachment as File, data.attachment?.name);
        formData.append("assignment", assignment._id);

        setLoadingReleaseResult(true);
        try {
            const response = await resultsCreate(formData);
            if (response.data.success) {
                releaseResultModalRef.current?.close();
                resetReleaseResult();
            }
        } catch (error: AxiosError | any) {
            if (error.response?.status === 400) {
                setError("root", {
                    type: "manual",
                    message: error.response.data.message || "Something went wrong"
                });

                console.error(error.response.data);
            } else {
                setError("root", {
                    type: "manual",
                    message: "Something went wrong"
                });
            }

            console.error(error);
        } finally {
            setLoadingReleaseResult(false);
        }
    };

    const { readRemoteFile } = usePapaParse();
    const [result, setResult] = React.useState<string | null>(null);

    const handleGetResult = React.useCallback(async () => {
        const { data } = await resultsGetAll(`assignment=${assignment._id}`);
        const result = data.data.results[0] as IResult;
        console.log(result);
        const matric = user.matric.toString();

        readRemoteFile(`${process.env.BACKEND_BASE_URL}/${result.attachment}`, {
            complete: (results) => {
                const data = results.data as string[][];
                const student = data.find((row) => row[2] === matric);
                if (student) {
                    setResult(student[4]);
                }
            },
            download: true,
            delimiter: "," // auto-detect
        });
    }, [assignment._id, readRemoteFile, user.matric]);

    React.useEffect(() => {
        if (user.role === "student" && assignment.isReleased) {
            const submission = assignment.submissions.find((submission) => submission === user._id);
            if (submission) {
                handleGetResult();
            }
        }
    }, [assignment.submissions, assignment._id, handleGetResult, user.role, user._id, assignment.isReleased]);

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div>
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{assignment.title}</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">{assignment.description}</p>
                    </div>
                    {canSubmit && <Button text="Submit Assignment" className="bg-green-700 text-white px-4 py-2 rounded-md" onClick={handleOpenModal} />}
                </div>
            </div>
            <div className="px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                    {assignment.attachment && (
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Attachment</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <a href={`${process.env.BACKEND_BASE_URL}/${assignment.attachment}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                                    Download Attachment
                                </a>
                            </dd>
                        </div>
                    )}
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <div className="flex items-center">
                                {format(new Date(assignment.dueDate), "dd MMMM yyyy")}
                                {/* check if assignment is overdue */}
                                {new Date(assignment.dueDate) < new Date() && <BsFillCalendarCheckFill className="ml-2 text-red-500" />}
                            </div>
                        </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Level</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{assignment.level}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Departments</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{assignment.departments.map((dept) => dept.name).join(", ")}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Submissions</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{assignment.submissions.length}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Created By</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{assignment.createdBy.name}</dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Created At</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{format(new Date(assignment.createdAt), "dd/MM/yyyy")}</dd>
                    </div>
                    {/* Release Result */}
                    {user.role === "lecturer" && (
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Release Result</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <div className="flex items-center space-x-5">
                                    {!assignment.isReleased && csvData.length > 0 ? (
                                        <>
                                            <CSVDownloader
                                                type={Type.Button}
                                                filename={`assignment-${assignment._id}-result`}
                                                bom={true}
                                                config={{
                                                    delimiter: ","
                                                }}
                                                data={csvData}
                                            >
                                                Download Template
                                            </CSVDownloader>
                                            <Button text="Release Result" className="bg-green-700 text-white px-4 py-2 rounded-md" onClick={handleOpenReleaseResultModal} />
                                        </>
                                    ) : (
                                        <Button text="Release Result" disabled title="No submissions yet" />
                                    )}

                                    {assignment.isReleased && <span className="text-green-600">Result Released</span>}
                                </div>
                            </dd>
                        </div>
                    )}
                    {/* View Result */}
                    {user.role === "student" && (
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Result</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{result ? result : "No result yet"}</dd>
                        </div>
                    )}
                </dl>
            </div>

            {/* Create Submission Modal */}
            <Modal noCancelButton ref={modalRef}>
                <div className="flex flex-col items-center justify-center max-w-[500px] p-5">
                    <h1 className="text-2xl font-bold text-center">
                        <span className="text-green-700">Submit</span> Assignment
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <FileInput
                            className="col-span-2"
                            control={control}
                            name="attachment"
                            label="Attachment"
                            rules={{
                                required: {
                                    value: true,
                                    message: "Attachment is required"
                                },
                                validate: {
                                    lessThan10MB: (file) => file?.size < 10000000 || "Max 10MB"
                                }
                            }}
                        />

                        <Button
                            loading={loading}
                            type="submit"
                            text="Submit"
                            className="w-full px-6 py-3 bg-green-700 text-white rounded-md font-semibold sm:col-span-2"
                            disabled={!isDirty || !isValid}
                        />
                        {errors.root && <p className="text-red-500 text-center">{errors.root.message}</p>}
                    </form>
                </div>
            </Modal>

            {/* Release Result Modal */}
            <Modal noCancelButton ref={releaseResultModalRef}>
                <div className="flex flex-col items-center justify-center max-w-[500px] p-5">
                    <h1 className="text-2xl font-bold text-center">
                        <span className="text-green-700">Release</span> Result
                    </h1>

                    <form onSubmit={handleSubmitReleaseResult(onSubmitReleaseResult)} className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <FileInput
                            className="col-span-2"
                            control={controlReleaseResult}
                            name="attachment"
                            label="Attachment"
                            rules={{
                                required: {
                                    value: true,
                                    message: "Attachment is required"
                                },
                                validate: {
                                    lessThan10MB: (file) => file?.size < 10000000 || "Max 10MB"
                                }
                            }}
                        />

                        <Button
                            loading={loadingReleaseResult}
                            type="submit"
                            text="Release"
                            className="w-full px-6 py-3 bg-green-700 text-white rounded-md font-semibold sm:col-span-2"
                            disabled={!isDirtyReleaseResult || !isValidReleaseResult}
                        />
                        {errorsReleaseResult.root && <p className="text-red-500 text-center">{errorsReleaseResult.root.message}</p>}
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default AssignmentPreview;
