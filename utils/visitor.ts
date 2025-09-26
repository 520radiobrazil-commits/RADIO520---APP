
interface Visitor {
    name: string;
    id: string;
}

const VISITOR_STORAGE_KEY = 'radio520_visitor';

export const getVisitorInfo = (): Visitor => {
    try {
        const storedVisitor = localStorage.getItem(VISITOR_STORAGE_KEY);
        if (storedVisitor) {
            return JSON.parse(storedVisitor);
        }
    } catch (error) {
        console.error("Failed to parse visitor info from localStorage", error);
    }

    // If no stored info, create a new one
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const newVisitor: Visitor = {
        name: `Ouvinte-${randomNumber}`,
        id: `visitor-${Date.now()}-${randomNumber}`,
    };

    try {
        localStorage.setItem(VISITOR_STORAGE_KEY, JSON.stringify(newVisitor));
    } catch (error) {
        console.error("Failed to save visitor info to localStorage", error);
    }

    return newVisitor;
};
