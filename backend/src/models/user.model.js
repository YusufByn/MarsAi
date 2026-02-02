import pool from '../config/db.js';

export async function registerUser({ email, passwordHash, firstName, lastName }) {

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

        const [result] = await connection.execute(
            'INSERT INTO user (email, password_hash, name, lastname) VALUES (?, ?, ?, ?)',
            [email, passwordHash, firstName, lastName]
        );

        await connection.commit();

        return {
            id: result.insertId,
            email,
            passwordHash,
            firstName,
            lastName,
        };

    } catch (error) {
        await connection.rollback();
        throw error; 

    } finally {
        connection.release();
    }
}

export async function getUserByEmail(email) {
    const [rows] = await pool.execute(
        'SELECT * FROM user WHERE email = ?', 
        [email]
    );
    return rows[0];
}

export async function incrementLoginAttempts(email) {
    const connection = await pool.getConnection();
    try {
        const query = `
            UPDATE user 
            SET 
                login_attempts = login_attempts + 1,
                lock_until = CASE 
                    WHEN login_attempts + 1 >= 5 THEN DATE_ADD(NOW(), INTERVAL 15 MINUTE) 
                    ELSE lock_until 
                END
            WHERE email = ?
        `;
        await connection.execute(query, [email]);
    } finally {
        connection.release();
    }
}

export async function resetLoginAttempts(email) {
    const connection = await pool.getConnection();
    try {
        const query = 'UPDATE user SET login_attempts = 0, lock_until = NULL WHERE email = ?';
        await connection.execute(query, [email]);
    } finally {
        connection.release();
    }
}

export const userModel = {
    registerUser,
    getUserByEmail, 
    incrementLoginAttempts,
    resetLoginAttempts
};
