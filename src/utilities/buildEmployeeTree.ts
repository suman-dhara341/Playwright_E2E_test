export function buildSelectedEmployeeTree(employees: any[], selectedEmployeeId: string, orgDetails: any): any[] {
    const employeeMap = new Map<string, any>();
    for (const emp of employees) {
        employeeMap.set(emp.employeeId, {
            ...emp,
            children: [],
            nodeType: "employee",
        });
    }
    for (const emp of employees) {
        if (emp.reportsTo && employeeMap.has(emp.reportsTo)) {
            const manager = employeeMap.get(emp.reportsTo)!;
            manager.children.push(employeeMap.get(emp.employeeId)!);
        }
    }
    const upwardChain: any[] = [];
    let current = employeeMap.get(selectedEmployeeId);

    while (current) {
        upwardChain.unshift(current);
        current = current.reportsTo ? employeeMap.get(current.reportsTo) : undefined;
    }
    const levelsAbove = upwardChain.length - 1;
    if (levelsAbove < 2) {
        const root: any = {
            ...orgDetails,
            children: [upwardChain[0]],
            nodeType: "organization",
        };
        return [root];
    }

    return [upwardChain[0]];
}