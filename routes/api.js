const route = require('express').Router();
const axios = require('axios')


route.get('/blog-stats',(req,res,next)=>{
    axios(process.env.API_URL+'/api/rest/blogs',{
        headers:{
            'x-hasura-admin-secret': process.env.API_SECRET
        }
    })
    .then((result)=>{
        // console.log((result.data.blogs))
        let set =new Set()
        let max = -1
        let matchIndex
        let privacyList = result.data.blogs.filter((data,index)=>{
            if(data.title.length>max){
                max = data.title.length
                matchIndex = index
            }
            set.add(data.title)
            return data.title.toLowerCase().includes("privacy")
        })

        return res.status(201).json({
            message:'Blog Analytics',
            total_no_of_blogs:result.data.blogs.length,
            title_of_longest_blog:result.data.blogs[matchIndex].title,
            no_of_privacy_titled:privacyList.length,
            unique_titled_array: Array.from(set),
        })
    })
    .catch((err)=>{
        next(err)
    })
})

route.get('/blog-search',(req,res,next)=>{
    const query  = req.query.query
    console.log(query)
    if(!query){
        throw {
            message:"Provide a query titled 'query' Eg./blog-search?query=privacy",
            statusCode:404,
        }
    }
    axios(process.env.API_URL+'/api/rest/blogs',{
        headers:{
            'x-hasura-admin-secret': process.env.API_SECRET
        }
    })
    .then((result)=>{
        // console.log((result.data.blogs))
        let filteredSearch = result.data.blogs.filter((data)=>{
            return data.title.toLowerCase().includes(query.toLocaleLowerCase())
        })
        if(filteredSearch.length==0){
            throw {
                message:"The search result does not match any of the blog, FilteredContent []",
                statusCode:201,
            }
        }
        return res.status(201).json({
            message:'Data Filtered',
            filteredBlog:filteredSearch
        })
    })
    .catch((err)=>{
        console.log(err)
        next(err)
    })
})

route.get('/all',(req,res,next)=>{
    axios(process.env.API_URL+'/api/rest/blogs',{
        headers:{
            'x-hasura-admin-secret': process.env.API_SECRET
        }
    })
    .then((result)=>{
        // console.log((result.data.blogs))
        return res.status(201).json({
            message:'Data Retrieved',
            blogs:result.data.blogs
        })
    })
    .catch((err)=>{
        next(err)
    })
})

module.exports = route