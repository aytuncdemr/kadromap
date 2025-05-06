export default function stringToRGB(str: string, opacity?: number) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const r = (hash >> 0) & 0xff;
    const g = (hash >> 8) & 0xff;
    const b = (hash >> 16) & 0xff;

    return `rgba(${r}, ${g}, ${b},${opacity ? opacity : 1})`;
}
