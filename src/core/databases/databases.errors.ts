export class DatabaseError extends Error {
    public constructor(message = 'Unknown database error') {
        super(message);
    }
}

export class DatabaseConfigError extends DatabaseError {
    public constructor(message = 'Database configuration error') {
        super(message);
    }
}
