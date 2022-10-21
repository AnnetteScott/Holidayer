export interface MainData {
    holidays: HolidayLayout
}

export interface HolidayLayout {
    [key: string]: { // ID
        attractions: {
            [key: string]: { // ID
                name: string,
                cost: number,
                place: string
            }
        }
        budget: {
            [key: string]: {
                amount: number,
                alreadyUsed: number
            }
        },
        duration: number,
        info: {
            [key: string]: { // ID
                name: string,
                info: string
            }
        },
        name: string,
        schedule: {
            [key: string]: ScheduleLayout
        },
        startDate: string
    }
}

export interface ScheduleLayout {
    name: string,
    startTime: string,
    endTime: string,
    address: string
}