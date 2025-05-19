export default function convertToISO(dateStr: string) {
    const [day, month, yearAndTime] = dateStr.split("/");
    const [year, time] = yearAndTime.split(" ");
    return `${year}-${month}-${day}T${time}:00`;
}
