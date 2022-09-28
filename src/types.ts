export interface MainData {
    holidays: HolidayLayout
}

export interface HolidayLayout {
    [key: string]: { // ID
            name: string,
            startDate: string,
            colour: string,
            duration: number,
            budget: {
                [key: string]: {
                    amount: number,
                    alreadyUsed: number
                }
            },
            itinerary: {
                [key: string]: { // ID
                    name: string,
                    startTime: string,
                    endTime: string
                }
            }
        }
}