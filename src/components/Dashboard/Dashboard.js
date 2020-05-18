import React from 'react';
import Config from "../../config";
import TokenService from '../../services/token-service'
export default class Dashboard extends React.Component{
    
    state={
        language:[],
        words:[],
    }
    
    componentDidMount(){
        console.log('hello')
        fetch(`${Config.API_ENDPOINT}/language`, {
            headers:{
                'authorization': 
                `Bearer ${TokenService.getAuthToken()}`   
            }
             
        }).then(res=>{
                if(!res.ok){
                    return res.json().then((e) => Promise.reject(e));
                }
                console.log('in promise1')
                return res.json()
            }).then((data) => {
                console.log('this is the ressss', data)
                //update state here
                this.setState({language:data.language, words:data.words})
            })
            .catch(error=>console.log(error))
                
            

    }
    
    render(){
      console.log(this.state.language)
      const wordings = this.state.words.map((x,id)=>{
          return <li key={id}>{x.original} is {x.translation} Correct: {x.correct_count} Wrong: {x.incorrect_count}</li>
      })
        return(
            <div>
                <ul>
                    {wordings}
                </ul>
                {this.state.language.name}<br/>
                Total Correct {this.state.language.total_score}
            </div>  
        )
    }
}