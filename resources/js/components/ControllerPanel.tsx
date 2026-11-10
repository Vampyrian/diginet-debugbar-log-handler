import type { ControllerRecord } from '../types.ts';
import {linkReplacer} from "../helpers/linkReplacer.ts";

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
                        {controller.name}
                    </a>
                </li>
            ))}
        </ul>
    );
}
