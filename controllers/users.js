const ApiEndpoint = require("../apiEndpoints")
const httpRequest = require("../services/httpRequest")
const fs = require('fs');

exports.getUsers = async () => {
    try {
        const data = fs.readFileSync('.memconfig', 'utf8')
        if (data.length == 0) {
            return
        }
        const credentials = JSON.parse(data.toString())
        httpRequest({
            method: "GET",
            url: `${credentials.server}${ApiEndpoint.GET_ALL_USERS}`,
            headers: { 'Authorization': 'Bearer ' + credentials.jwt },
            bodyParams: null,
            queryParams: null,
            timeout: 0,
        })
            .then(res => {
                res.sort((a, b) => a.creation_date.localeCompare(b.creation_date))
                console.table(
                    res.map(user => {
                        return {
                            "user_name": user.username,
                            "creation_date": user.creation_date,
                            "user_type": user.user_type,
                        };
                    }))
            })
            .catch((error) => {
                // console.error(error);
                console.log("Failed fetching all users")
            })
    } catch (error) {
        // console.error((error));
        console.log("Failed fetching all users")
    }
}

exports.addUser = async (user) => {
    try {
        const data = fs.readFileSync('.memconfig', 'utf8')
        if (data.length == 0) {
            return
        }
        const credentials = JSON.parse(data.toString())
        httpRequest({
            method: "POST",
            url: `${credentials.server}${ApiEndpoint.ADD_USER}`,
            headers: { 'Authorization': 'Bearer ' + credentials.jwt },
            bodyParams: {
                "username": user.name,
                "password": user.password,
                // "hub_username": user.hubuser,
                // "hub_password": user.hubpass,
                "user_type": user.type,
                "avatar_id": parseInt(user.avatar),
            },
            queryParams: null,
            timeout: 0,
        })
            .then(res => {
                console.log(`User ${res.username} was created.`);
            })
            .catch((error) => {
                // console.error(JSON.stringify(error))
                console.log(`Failed adding ${user.name} user.`)
            })
    } catch (error) {
        // console.error((error));
        console.log(`Failed adding ${user.name} user.`)
    }
}

exports.removeUser = async (user) => {
    try {
        const data = fs.readFileSync('.memconfig', 'utf8')
        if (data.length == 0) {
            return
        }
        const credentials = JSON.parse(data.toString())
        httpRequest({
            method: "DELETE",
            url: `${credentials.server}${ApiEndpoint.REMOVE_USER}`,
            headers: { 'Authorization': 'Bearer ' + credentials.jwt },
            bodyParams: { "username": user },
            queryParams: null,
            timeout: 0,
        })
            .then(res => {
                Object.keys(res).length === 0 ? console.log(`User ${user} was removed.`) : console.log(`Failed removing user ${user}.`)
            })
            .catch((error) => {
                console.log(`Failed removing user ${user}.`)
            })
    } catch (error) {
        // console.error((error));
        console.log(`Failed removing user ${user}.`)
    }
}

// exports.edithubcred = async (user) => {
//     try {
//         const data = fs.readFileSync('.memconfig', 'utf8')
//         if (data.length == 0) {
//             return
//         }
//         const credentials = JSON.parse(data.toString())
//         httpRequest({
//             method: "PUT",
//             url: `${credentials.server}${ApiEndpoint.EDIT_HUB_CREDS}`,
//             headers: { 'Authorization': 'Bearer ' + credentials.jwt },
//             bodyParams: {
//                 "hub_username": user.hubuser,
//                 "hub_password": user.hubpass,
//             },
//             queryParams: null,
//             timeout: 0,
//         })
//             .then(res => {
//                 user.hubuser && console.log(`User's hub name was updated.`)
//                 user.hubpass && console.log(`User's hub password was updated.`)
//             })
//             .catch((error) => {
//                 console.error(`Failed updating hub credentials.`)
//             })
//     } catch (error) {
//         // console.error((error));
//         console.error(`Failed updating hub credentials.`)
//     }
// }