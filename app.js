//載入(require) express 到此project
const express = require('express')
const app = express()
const port = 3001

//引入外部json檔 為了渲染全部的資料不用在一筆一筆的輸入
const restaurantList = require('./restaurant.json')

// require express-handlebars here
const exphbs= require('express-handlebars')

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
//app.use 所有中不管哪個路由進來的請求，都先幫我走進靜態檔案的資料夾中
app.use(express.static('public'))


//routing setting
app.get('/', (req, res) =>{
  // console.log(res)
  // res.send('this is restaurant web')

  // past the movie data into 'index' partial template
  res.render('index', { restaurants: restaurantList.results })
})

//動態routing setting 去對應id後去show的handlebars那渲染到頁面上
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find( //變數restaurant 是陣列
    restaurant => restaurant.id.toString() === req.params.restaurant_id
  ) //results陣列裡的每個元素=>每個元素是物件要看id的值   restaurant_id是字串    
  res.render('show', { restaurant : restaurant })
})           //進到show模板會用的名稱  變數restaurantU也render進去

//setting search routing
app.get('/search', (req, res) => {
  if (!req.query.keyword) {
    return res.redirect('/')
  }
  
  const keywords = req.query.keyword.trim().toLowerCase()
  const restaurants = restaurantList.results.filter(restaurant => 
    restaurant.name.toLowerCase().includes(keywords) || 
    restaurant.category.includes(keywords)
  )
  
  res.render('index', { restaurants: restaurants, keywords: keywords })
})

// app.get('/search', (req, res) => {
//   console.log(req.query)
//   const keyword = req.query.keyword
//   const category = restaurantList.results.filter(restaurant => {
//     return restaurant.category.toLowerCase().includes(keyword.toLowerCase())
//   })  

//   res.render('index', { category: category, keyword: keyword })
// })



//start and listening on the Express server
app.listen(port, () =>{
  console.log(`Express is listening on localhost:${port}`)
})