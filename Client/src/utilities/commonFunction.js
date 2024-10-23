import axios from "axios";
import { DOMAIN } from "../Constant";

class commonfunction {
    constructor() {
        this.enddate = Date.now();
    }
    getHours = (startdate) => {
        const start = new Date(startdate).getTime();
        const end = new Date(this.enddate).getTime();
        console.log(start, end, startdate, new Date('2024-09-30T17:26:20.618Z'),new Date().toISOString(), this.enddate);
        const timeDifference = end - start;
        const timeDifferenceInHours = timeDifference/(1000 * 60 * 60);

        return timeDifferenceInHours.toFixed(2);
    }

    unlinkfiles = async (arg) => {
        try {
            await axios.post(`${DOMAIN}/api/unlink-files`, arg)
                .then(rs => {
                    console.log(`Sucessfully unline files`, rs);
                }).catch(error => {
                    console.error(`Error:: `, error);                    
                })
        } catch(error) {
            console.error(`Error:: ${error}`)
        }
    }
    
};

export default new commonfunction();
