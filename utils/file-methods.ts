class FileMethods {
    fileToBase64(file: File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result?.toString();
                if (result) {
                    resolve(result.split(",")[1]);
                } else {
                    reject(new Error("Failed to convert file to base64"));
                }
            };
            reader.onerror = () => {
                reject(new Error("Failed to read file"));
            };
        });
    }
}

const fileMethods = new FileMethods();

export default fileMethods;
