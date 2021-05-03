import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {router} from './router'

Vue.use(Vuex)

const store = new Vuex.Store({
    state : {
        token : "",
        fbAPIKey : "AIzaSyDBs1DMTnZop1w-ZmT_f-mzFCMXmYLAAz4"
    },
    mutations : {
        setToken (state, token){
            state.token = token
        },
        clearToken(state,token){
            state.token = token
        }
    },
    actions : {
        initAuth({dispatch,commit}){
            
            let token = localStorage.getItem("token")
            if(token){

                let expDate = localStorage.getItem("expDate")
                let time = new Date().getTime()

                if(time > +expDate){
                    dispatch("logout")
                }else{
                    commit("setToken",token)
                    let timer = +expDate - time
                    dispatch("setTimeoutTimer",timer)
                    router.push('/')
                }



                
            }else{
                router.push('/Auth')
                return false
            }
        },
        login({commit,dispatch,state},authData){
            let authLink = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="
                if(authData.isUser){
                    authLink = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
                }
               return axios.post(authLink + 'AIzaSyDBs1DMTnZop1w-ZmT_f-mzFCMXmYLAAz4',
                {email : authData.email, password : authData.password , returnSecureToken : true}
                ).then(response=>{
                    commit("setToken", response.data.idToken)
                    localStorage.setItem("token",response.data.idToken)
                    localStorage.setItem("expDate", new Date().getTime() + +response.data.expiresIn * 10000)
                    dispatch("setTimeoutTimer",+response.data.expiresIn * 10000)
                })
            
        },
        logout({commit,dispatch,state}){
            commit("clearToken")
            localStorage.removeItem("token")
            localStorage.removeItem("expDate")
            router.replace('/Auth')
        },
        setTimeoutTimer({dispatch},expressIn){
            setTimeout(()=>{
                dispatch("logout")
            },expressIn)
        }
    },
    getters : {
         isAuthen(state){
             return state.token !== ""
         }
    }
})

export default store