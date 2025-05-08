import { Department } from "../interfaces/Department";
import { User } from "../interfaces/User";
import { mongodb } from "./mongodb";

export default async function getDepartments() {
    const { departments, users } = await mongodb();

    const departmentDocuments = (await departments
        .find({})
        .toArray()) as unknown as Department[];
    const deparmentDocumentsSettled = await Promise.all(
        departmentDocuments.map(async (departmentDocument) => {
            const chief = (await users.findOne({
                _id: departmentDocument.chief._id,
            })) as unknown as User;
            departmentDocument.chief.email = chief.email;

            await Promise.all(
                departmentDocument.employees.map(async (employee) => {
                    const employeeDocument = (await users.findOne({
                        _id: employee._id,
                    })) as unknown as User;
                    employee.email = employeeDocument.email;
                })
            );
            return departmentDocument;
        })
    );    


    return deparmentDocumentsSettled;
}
