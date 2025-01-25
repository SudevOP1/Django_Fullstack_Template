import { React, useState, createContext, useContext, useEffect } from 'react'
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom'


const AuthContext = createContext()
export default AuthContext;


export const AuthProvider = ({children}) => {
    
    let api_link = "http://127.0.0.1:8000/"
    const navigate = useNavigate();

    let [loading, setLoading] = useState(true)
    let [user, setUser] = useState(() => localStorage.getItem("authTokens")? JSON.parse(localStorage.getItem("authTokens")): null)
    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null)

    let loginUser = async(e) => {
        e.preventDefault()
        let response = await fetch(api_link+"base/auth/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": e.target.username.value,
                "password": e.target.password.value
            })
        })
        if(response.status === 200) {
            let data = await response.json()
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem("authTokens", JSON.stringify(data))
            navigate("/")
        } else {
            alert("Something went wrong: ", response.error)
        }
    }
    
    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("authTokens")
        navigate("/login")
    }
    
    let updateToken = async() => {
        let response = await fetch(api_link+"base/auth/token/refresh/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"refresh": authTokens?.refresh})
        })
        if(response.status === 200) {
            let data = await response.json()
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem("authTokens", JSON.stringify(data))
        } else {
            logoutUser()
        }
        if(loading) {
            setLoading(false)
        }
    }

    let contextData = {
        user: user,
        api_link: api_link,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
        updateToken: updateToken,
    }

    useEffect(() => {

        if(loading) {
            updateToken()
        }

        let interval = setInterval(() => {
            if(authTokens) {
                updateToken()
            }
    }, 1000*60*4) // call updateToken after every 4 minutes
        return () => clearInterval(interval)
    }, [authTokens, loading])

    return (
        <AuthContext.Provider value={contextData} >
            {loading ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    )
}