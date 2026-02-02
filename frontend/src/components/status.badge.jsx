export default function StatusBadge({ status }) {
    const styles = {
        approved: "bg-green-100 text-green-700 border-green-200",
        rejected: "bg-red-100 text-red-700 border-red-200",
        pending: "bg-gray-100 text-gray-700 border-gray-200"
    };

    const labels = {
        approved: "VALIDÉ",
        rejected: "REFUSÉ",
        pending: "EN ATTENTE"
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.pending}`}>
            {labels[status] || labels.pending}
        </span>
    );
}