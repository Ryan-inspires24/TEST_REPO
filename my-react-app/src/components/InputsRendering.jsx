export function SimpleTextInput({ label, value, onChange }) {
    return (
        <input
            type="text"
            placeholder={label}
            value={value}
            onChange={e => onChange(e.target.value)}
            required
        />
    );
}

export function FreeTextInput({ label, value, onChange }) {
    return (
        <textarea
            placeholder={label}
            value={value}
            onChange={e => onChange(e.target.value)}
            required />
    );
}

export function DateTimeInput({ value, onChange }) {
    return (
        <input
            type="date"
            value={value}
            onChange={e => onChange(e.target.value)}
            required />
    );
}

export function DefaultInput({ label, value, onChange }) {
    return (
        <textarea
            placeholder={label + ' (defaulted to text)'}
            value={value}
            onChange={e => onChange(e.target.value)}
            required />
    );
}
