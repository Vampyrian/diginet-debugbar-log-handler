import {useState} from "react";

export default function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleClick = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="w-14 shrink-0 cursor-pointer rounded border border-neutral-700 px-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
        >
            {copied ? "Copied" : "Copy"}
        </button>
    );
}