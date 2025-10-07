
// This tells TypeScript that these libraries are loaded globally from the CDN in index.html
declare const pdfjsLib: any;
declare const Tesseract: any;

const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
        reader.readAsText(file);
    });
};

const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
     return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
        reader.readAsArrayBuffer(file);
    });
}

const extractTextFromPdf = async (file: File): Promise<string> => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js`;
    
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
    }

    return fullText;
};

const extractTextFromImage = async (file: File): Promise<string> => {
    const { data: { text } } = await Tesseract.recognize(file, 'eng');
    return text;
};


export const processFile = async (file: File): Promise<string> => {
    if (file.type === 'text/plain') {
        return readFileAsText(file);
    } else if (file.type === 'application/pdf') {
        return extractTextFromPdf(file);
    } else if (file.type.startsWith('image/')) {
        return extractTextFromImage(file);
    } else {
        throw new Error(`Unsupported file type: ${file.type}. Please upload a .txt, .pdf, or image file.`);
    }
};
