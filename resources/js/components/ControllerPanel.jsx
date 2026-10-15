// Turns "phpstorm://open?file=/Erp/Controller/HomeController.php&line=50" into "/Erp/Controller/HomeController.php:50".
const linkLabel = (link) => {
    try {
        const params = new URL(link).searchParams;
        const file = params.get('file');

        return file ? `${file}${params.get('line') ? `:${params.get('line')}` : ''}` : link;
    } catch {
        return link;
    }
};

export default function ControllerPanel({ controllers = [] }) {
    if (controllers.length === 0) {
        return <p className="text-neutral-500">No controller.</p>;
    }

    return (
        <ul className="space-y-1">
            {controllers.map((controller, index) => (
                <li key={index}>
                    <a href={controller.link} className="text-sky-400 hover:underline">
                        {linkLabel(controller.link)}
                    </a>
                </li>
            ))}
        </ul>
    );
}
