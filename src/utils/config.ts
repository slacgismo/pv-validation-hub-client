"use client"

import axios from "axios"

// this file is intended to contain general utility functions
// post http://198.129.116.252 
// Json body example {"id":0,"method":"Switch.Set","params":{"id":0,"on":false}}
// apower in watts, current in amps, and voltage in volts
const configUtils = {
    ipconfig: async (ipaddr: string): Promise<{ amps: number, watts: number, volts: number }> => {
        let ret: { amps: number, watts: number, volts: number } = {
            amps: 0,
            watts: 0,
            volts: 0
        };
        
        try {
            const res = await axios.post(`/api/shellydata`, { ipaddr });
            ret = {
                amps: res.data.amps, 
                watts: res.data.watts, 
                volts: res.data.volts
            };
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        
        return ret;
    },

    powerswitch: async (ipaddr: string, status: boolean) => {
        try {
            const res = await axios.post(`/api/powerswitch`, { ipaddr, status });
            if (res.data.status) {
                return status;
            } else {
                throw new Error(res.data.error || "Unknown error");
            }
        } catch (err) {
            console.error(err);
            return err;
        }
    }
}
export default configUtils;
