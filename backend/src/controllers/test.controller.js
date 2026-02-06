export async function testController(req, res) {
    try {
        res.status(200).json({ message: 'Test route' });
    } catch (error) {
        res.status(500).json({ message: 'Error test route' });
    }
}