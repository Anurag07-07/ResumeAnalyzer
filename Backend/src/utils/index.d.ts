declare global {
    namespace Express {
        interface Request {
            userid?: string;
        }
    }
}

