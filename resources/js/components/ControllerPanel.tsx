import type { ControllerRecord } from '../types.ts';
import {linkReplacer} from "../helpers/linkReplacer.ts";

// Turns "phpstorm://open?file=/Erp/Controller/HomeController.php&line=50" into "/Erp/Controller/HomeController.php:50".
const linkLabel = (link: string): string => {
    try {
        const params = new URL(link).searchParams;
        const file = params.get('file');

        return file ? `${file}${params.get('line') ? `:${params.get('line')}` : ''}` : link;
    } catch {
        return link;
    }
};

interface ControllerPanelProps {
    controllers?: ControllerRecord[];
}

export default function ControllerPanel({ controllers = [] }: ControllerPanelProps) {
    if (controllers.length === 0) {
        return <p className="text-neutral-500">No controller.</p>;
    }

    return (
        <ul className="space-y-1">
            {controllers.map((controller, index) => (
                <li key={index}>
                    <a href={linkReplacer(controller.link)} className="text-sky-400 hover:underline">
                        {linkReplacer(linkLabel(controller.link))}
                    </a>
                </li>
            ))}
        </ul>
    );
}
