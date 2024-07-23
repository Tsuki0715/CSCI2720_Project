import path from "path";
import fs from "fs";

import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import express from "express";
import RoutesDef from "../src/RoutesDef";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/project');

const lcsd = 'https://www.lcsd.gov.hk/datagovhk/event/events.xml';
const lcsd2 = 'https://www.lcsd.gov.hk/datagovhk/event/eventDates.xml';
const lcsd3 = 'https://www.lcsd.gov.hk/datagovhk/event/venues.xml';
const xml2js = require('xml2js');

var currentDate = new Date().toLocaleTimeString();

const session = require('express-session');
app.use(session({
    secret: 'z0ig-n3@io',
    name: 'sessionId', // optional
    saveUninitialized: false,
    resave: true,
	rolling: true
}));

app.use(
    express.static("build")
);

app.use(
    express.static("dist")
);

app.use('/Image',
    express.static("./public/Image")
);

const {
    Schema
} = mongoose;
const db = mongoose.connection;
db.on('error', function(){
	console.error.bind(console, 'Database connection error:');
	app.get("*", (req, res) => {
        	return res.set('Content-Type', 'text/plain').status(500).send("Internal Server Error");
	});
});
db.once('open', function() {
    console.log("Database connection is open...");
	const userSchema = mongoose.Schema({
        role: { //10 for user, 99 for admin
            type: Number,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
			required: true
        },
		favLoc: [String]
    });
  
    const dataSchema = mongoose.Schema
    ({
        EventID:{ type:Number, requried: true},
        Title:{ type: String, required: true},
        Venue:{ type: String, required: true},
        Date:[{ type: String, required: true}],
        Time:{ type: String, required: true},
        Description:{ type: String},
        Presenter:{ type: String, required: true},
        Price:[{ type: Number}],
        Latitude:{ type: String},
        Longitude:{ type: String},
    })

    const locationSchema = mongoose.Schema
    ({
        Venue:{ type:String, requried: true},
        Latitude:{ type: String},
        Longitude:{ type: String},
        Comments: [{User:{type: String}, Comment:{type: String}}],
        NumberOfEvents: {type: Number}
    })
      
    
    const User = mongoose.model('User', userSchema);
    
    const Data = mongoose.model('Data', dataSchema);
    const Loc = mongoose.model('Loc', locationSchema);

	async function auth(req, res, next) {
		if (req.session.username && req.session.password) {
			const user = await User.findOne({ username: req.session.username, password: req.session.password });
			if(user) next();
			else return res.set('Content-Type', 'text/plain').status(403).send('unauthorized');
		} else {
			return res.set('Content-Type', 'text/plain').status(403).send('unauthorized');
		}
	}
	
        async function Fetch_LCSD_Data() 
        {
        try 
        {
          const response = await fetch(lcsd);
          const response2 = await fetch(lcsd2);
          const response3 = await fetch(lcsd3);
    
          const xmlData = await response.text();
          const xmlData2 = await response2.text();
          const xmlData3 = await response3.text();
    
          const parser = new xml2js.Parser();
          
          await Data.deleteMany({})
          .then(() => {
            console.log('Data cleared successfully.');
          })
          .catch((error) => {
            console.error('Error clearing collection:', error);
          });

          await parser.parseString(xmlData, (err, jsonData) => 
          {
            if (err) {
              console.error('Error Parsing LCSD data:', err);
              return;
            }
            else
            {
                jsonData.events.event.forEach((d)=>
                {
                    let priceArray = d.pricee[0];
                    let validPrice = [];
                    for(let i=0; i < priceArray.length; i++)
                    {
                        if(priceArray.charCodeAt(i) == 36)
                        {
                            let index = i+1;
                            for(let k=i+1; k<priceArray.length; k++)
                            {
                                if(priceArray.charCodeAt(k) >= 48 && priceArray[k] <= 57)
                                {
                                    // console.log(priceArray[k]);
                                    continue;
                                }
                                else
                                {
                                    index = k;
                                    break;
                                }
                            }
                            thisPrice = priceArray.slice(i+1,index);
                            if(thisPrice.length != 0)
                            {
                                validPrice.push(thisPrice);
                                // console.log(thisPrice);
                            }
                        }
                    }
                    // console.log(priceArray);

                    let newData = new Data({
                    EventID: d.$.id,
                    Title: d.titlee[0],
                    Venue: d.venueid[0],
                    Date: d.predateE[0],
                    Time: d.predateE[0],
                    Description: d.desce[0],
                    Presenter: d.presenterorge[0],
                    Price: validPrice,
                    Longitude: "",
                    Latitude: "",
                  })
                  // console.log(d.titlee[0]);
                  // console.log('\n');
                  newData.save()
                  .then(()=>
                  {
                    // console.log("New Data added to database");
                  })
                  .catch((error) => 
                  {
                    console.log("Error when adding data into database"+error);
                  });
                  // console.log(newData);
                });
            }
          });
    
          await parser.parseString(xmlData2, (err, jsonData) =>
          {
            if (err) {
              console.error('Error Parsing LCSD data2:', err);
              return;
            }
            else
            {
                jsonData.event_dates.event.forEach((d)=>
                {
                    //console.log(d.$.id +" "+d.indate[0]);
                    let thisData = Data.findOneAndUpdate({EventID : d.$.id}, {Date : d.indate})
                    .then((data) =>
                    {

                    })
                    .catch((error) =>
                    {
                        console.log(""+error);
                    });
                });
            }
          });
    
          await parser.parseString(xmlData3, (err, jsonData) =>
          {
            if (err) {
              console.error('Error Parsing LCSD data3:', err);
              return;
            }
            else
            {
                jsonData.venues.venue.forEach((d)=>
                {
                    // console.log("Searching for venueID "+ d.$.id);
                    // console.log(d.venuee[0]+" "+d.longitude[0]+" "+d.latitude);
                    Loc.find({ Venue: d.venuee[0] })
                    .then((results) => 
                    {
                      if (results.length > 0) 
                      {
                        results.map((r)=>
                        {
                            r.NumberOfEvents = 0;
                            r.save();
                        });
                      } 
                      else 
                      {
                        let newLoc = new Loc({
                            Venue: d.venuee[0],
                            Longitude: d.longitude[0],
                            Latitude: d.latitude[0],
                            NumberOfEvents: 0,
                        })
                        newLoc.save();
                      }
                    });
                    Data.updateMany( {Venue : d.$.id}, {$set:{Longitude : d.longitude[0], Latitude : d.latitude[0], Venue : d.venuee[0]}} )
                    .then((data) =>
                    {

                    })
                    .catch((error) =>
                    {
                        console.log(error);
                    });
                });
            }
          });

          Data.find({})
          .then((datas)=>
          {
            datas.map((data)=>
            {
                // console.log(data.Venue);
                Loc.updateOne({Venue: data.Venue}, {$inc:{NumberOfEvents: 1}})
                .then((d)=>
                {
                    // console.log(d);
                });
            });
          });
        }
        catch (error) 
        {
          console.error('Error fetching LCSD data:', error);
        }
      } 

    app.post('/location', async (req, res) =>
    {
        // const sort = req.body.sort;
        const projectRequirement_Venue_Value = 10;
        const projectRequirement_Venue_LeastEventValue = 3;
        let count =0;
        let locationArray = [];
        let jsonData = "{";

        Loc.find({})
        .sort({NumberOfEvents:-1})
        .then((datas) =>
        {
            // console.log(datas.length);
            for(let i=0; i<datas.length; i++)
            {
                if(count >= projectRequirement_Venue_Value) break;
                if(datas[i].NumberOfEvents >= projectRequirement_Venue_LeastEventValue)
                {
                    jsonData += `"location${count+1}_id":{"Venue":"${datas[i].Venue}","NumberOfEvents":"${datas[i].NumberOfEvents}","Longitude":"${datas[i].Longitude}","Latitude":"${datas[i].Latitude}"},`;
                    count ++;
                }
            }
            // console.log(jsonData);
            jsonData = jsonData.replace(/,([^,]*)$/, "$1") + "}";

            res.status(200).json(jsonData);
        })
        .catch((error) =>
        {
            res.status(403).type("text/plain").send(error);
        });
    });

    app.post('/event', async (req, res) =>
    {
        let eventCount = 0;
        let jsonData = [];
        await Data.find({})
        .then((datas) =>
        {
            datas.map(data=>
            {
                jsonData.push(data);
                // eventCount ++;
                // jsonData += 
                // `"event${eventCount}_id":{"EventID": "${data.EventID}","Title": "${data.Title}","Venue": "${data.Venue}","Date": "${data.Date}","Time": "${data.Time}","Description": "${data.Description}","Presenter": "${data.Presenter}","Price": "${data.Price}","Longitude": "${data.Longitude}","Latitude": "${data.Latitude}"},`;
            })
            // console.log(jsonData);
            // jsonData = jsonData.replace(/,([^,]*)$/, "$1") + "}";
            res.status(200).json(jsonData);
        })
        .catch((error) =>
        {
            res.status(403).type("text/plain").send(error);
        });
    });

    app.post('/eventfilter', async (req, res) =>
    {
        // const filterVenue = req.params.filterVenue;
        // const filterDate = req.params.filterDate;
        // const filterTime = req.params.filterTime;
        // const searchTerm = req.body.searchTerm;
        const filterLowPrice = req.body.filterLowPrice;
        const filterHighPrice = req.body.filterHighPrice;

        let jsonData = [];
        try
        {
            let filterData = Data.find({});
            // console.log(searchTerm.length);
            // if(searchTerm.length != 0)
            // {
            //     filterData.find({ Title: { $regex: searchTerm, $options: "i" } });
            // }
            // if(filterVenue.Trim().length != 0)
            // {
            //     filterData.find({Venue:filterVenue});
            // }
            // if(filterDate.Trim().length != 0)
            // {
            //     filterData.find({Date:filterDate});
            // }
            // if(filterTime.Trim().length != 0)
            // {
            //     filterData.find({Time:filterTime});
            // }
            filterData.find({Price : {$gte: filterLowPrice}});
            filterData.find({Price : {$lte: filterHighPrice}})
            .then((datas) => 
            {
                datas.map((data, index)=>
                {
                    jsonData.push(data);
                    // jsonData += `event${index}_id:{'EventID': '${data.EventID}','Title': '${data.Title}','Venue': '${data.Venue}','Date': '${data.Date}','Time': '${data.Time}','Description': '${data.Description}','Presenter': '${data.Presenter}','Price': '${data.Price}','Longitude': '${data.Longitude}','Latitude': '${data.Latitude}',},`;
                })
                res.status(200).json(jsonData);
                // jsonData = jsonData.replace(/,([^,]*)$/, "$1") + "}";
                // res.status(200).json(jsonData);
            })
            .catch(error=>
            {
                res.status(403).type("text/plain").send(error);
            });
        }
        catch(error)
        {
            res.status(403).type("text/plain").send(error);
        }
    });

    app.post('/locationDetail', async (req, res) =>
    {
        const locID = req.body.locationname;
        let jsonData = "";
        Loc.findOne({Venue:locID})
        .then((data)=>
        {
            //console.log(data)
            res.status(200).json(data);
        })
        .catch((error)=>
        {
            res.status(403).type("text/plain").send(error);
        })
    });

    app.put('/location/newcomment', async (req, res) =>
    {
        const locationname = req.body.venue;
        const username = req.body.username;
        const comment = req.body.cm;
        Loc.findOneAndUpdate({Venue:locationname},{$push: { Comments: { User: username, Comment: comment } }},{new: true})
        .then((data)=>
        {
            res.status(200).send(data);
        })
        .catch((error)=>
        {
            res.status(404).type("text/plain").send(error);
        })
    });

    app.post('/eventdatematch', async (req, res) =>
    {
        const date = req.body.date;
        
        try { 
            const datas = await Data.find({ Date: date});

            const jsonData = datas.map (data => ({
                Title: data.Title,
            }));
            // console.log(jsonData);
            res.status(200).send(jsonData);
        
        } catch(error) 
        {
            res.status(404).type("text/plain").send(error);
        }
    });

    app.post("/location/keyword", async (req, res) =>
    {
        const keyword = req.body.keyword;
        try 
        { 
            Loc.find({ Venue: { $regex: keyword, $options: "i" } })
            .sort({NumberOfEvents:-1})
            .then((data)=>
            {
                res.status(200).send(data);
            })
            .catch((error)=>
            {
                res.status(404).type("text/plain").send(error);
            })
        } 
        catch(error) 
        {
            res.status(404).type("text/plain").send(error);
        }
    });

    app.post("/profile/lastUpdateTime", async (req, res) =>
    {
        try 
        {
            let jsonData = {lastUpdateTime: currentDate};
            res.status(200).send(jsonData);
        } 
        catch(error) 
        {
            res.status(404).type("text/plain").send(error);
        }
    });

    const LCSD_Fetch = Fetch_LCSD_Data();
	
	app.post('/login', async (req, res) => {
        const {
            username,
            password,
			rem
        } = req.body;
        try {
			if(req.session.username && req.session.password){
				const user = await User.findOne({ username: req.session.username });
				if(user){
					const { role, password: passwordDb } = user;
					if(req.session.password == passwordDb){
						let result = { role, "username": req.session.username };
						return res.status(200).send(JSON.stringify(result));
					}
				}
				
			}
			if(rem === 1){
				const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
				app.use(session({
					secret: 'z0ig-n3@io',
					name: 'sessionId',
					saveUninitialized: false,
					resave: true,
					rolling: true,
					cookie: {
						maxAge: expiryDate
					}
				}));
			}
            const user = await User.findOne({ username });
            if (!user) {
                res.set('Content-Type', 'text/plain').status(403).send('noUser');
                return;
            }
			const { role, username: usernameDb, password: passwordDb } = user;
            if (passwordDb != password) {
                res.set('Content-Type', 'text/plain').status(403).send('wrongPassword');
                return;
            }
			req.session.username = usernameDb;
			req.session.password = passwordDb;
			let result = { role, "username": usernameDb };
            Fetch_LCSD_Data();
            currentDate = new Date().toLocaleTimeString();
			return res.status(200).send(JSON.stringify(result));
        } catch (error) {
            console.log(error);
			res.set('Content-Type', 'text/plain').status(500).send('Internal Server Error');
        }
    });

	app.get('/logout', (req, res) => {
        	if(req.session.destroy(() => {
			return res.set('Content-Type', 'text/plain').status(200).send("success");
		})) return;
		return res.set('Content-Type', 'text/plain').status(406).send("failed");
    });

	app.get('/logged', auth, async (req, res) => {
		return res.set('Content-Type', 'text/plain').status(200).send('logged');
    });

	app.get('/favorite', auth, async (req, res) => {
        try {
			const user = await User.findOne({
                username: req.session.username
            });
		const { favLoc } = user;
            return res.status(200).send(favLoc);
        } catch (error) {
            console.log(error);
			res.set('Content-Type', 'text/plain').status(500).send('Internal Server Error');
        }
    });

	app.post('/savefavorite', auth, async (req, res) => {
		const {
            locName
        } = req.body;
        try {
		const check = await User.findOne({username: req.session.username});
		const {favLoc} = check;
		if(favLoc.includes(locName)) return res.set('Content-Type', 'text/plain').status(409).send('favAlreadyExists');
			const user = await User.findOneAndUpdate({
                username: req.session.username
            }, {
                $push: {
			favLoc: locName
		}
            });
		
			return res.set('Content-Type', 'text/plain').status(200).send('success');
        } catch (error) {
            console.log(error);
			res.set('Content-Type', 'text/plain').status(500).send('Internal Server Error');
        }
    });
	
	//Registration
	app.post('/registration', async (req, res) => {
		const {
			username,
            password
        } = req.body;
        try {
			const user = await User.findOne({ username });
            if (user) {
                res.set('Content-Type', 'text/plain').status(409).send('userAlreadyExists');
                return;
            }
			const newUser = new User({
				role: 10,
				username,
				password
			});
			await newUser.save();
			return res.set('Content-Type', 'text/plain').status(201).send('success');
        } catch (error) {
            console.log(error);
			res.set('Content-Type', 'text/plain').status(500).send('Internal Server Error');
        }
    });
	
	//Admin API
	async function authAdmin(req, res, next) {
		if (req.session.username && req.session.password) {
			const user = await User.findOne({ username: req.session.username, password: req.session.password });
			const { role } = user;
			if(role === 99){
				next();
			} else {
				return res.set('Content-Type', 'text/plain').status(403).send('unauthorized');
			}
		} else {
			return res.set('Content-Type', 'text/plain').status(403).send('unauthorized');
		}
	}
	
	app.post('/user', authAdmin, async (req, res) => {
		const {
			role,
            username,
            password
        } = req.body;
        try {
			const user = await User.findOne({ username });
            if (user) {
                res.set('Content-Type', 'text/plain').status(409).send('userAlreadyExists');
                return;
            }
			const newUser = new User({
				role,
				username,
				password
			});
			await newUser.save();
			return res.set('Content-Type', 'text/plain').status(201).send('success');
        } catch (error) {
            console.log(error);
			res.set('Content-Type', 'text/plain').status(500).send('Internal Server Error');
        }
    });

	app.post('/user/search', authAdmin, async (req, res) => {
		const {
			username
        } = req.body;
        try {
			const user = await User.findOne({ username });
            if (!user) {
                res.set('Content-Type', 'text/plain').status(404).send('noUser');
                return;
            }
			const { password } = user;
			return res.set('Content-Type', 'text/plain').status(200).send(password);
        } catch (error) {
            console.log(error);
			res.set('Content-Type', 'text/plain').status(500).send('Internal Server Error');
        }
    });
	
	app.put('/user', authAdmin, async (req, res) => {
		const {
            username,
            password
        } = req.body;
        try {
			const user = await User.findOneAndUpdate({
                username
            }, {
                password
            });
            if (!user) {
                res.set('Content-Type', 'text/plain').status(404).send('noUser');
                return;
            }
			return res.set('Content-Type', 'text/plain').status(204).send('success');
        } catch (error) {
            console.log(error);
			res.set('Content-Type', 'text/plain').status(500).send('Internal Server Error');
        }
    });

	app.post('/adminevent', authAdmin, async (req, res) =>
    {
        const {eventID, eventTitle, eventLocation, eventDate, eventTime, eventDescription, eventPresenter, eventPrice} = req.body;

        try { 
            let newData = new Data({
                EventID: eventID,
                Title: eventTitle,
                Venue: eventLocation,
                Date: eventDate,
                Time: eventTime,
                Description: eventDescription,
                Presenter: eventPresenter,
                Price: eventPrice,
                Longitude: "",
                Latitude: "",
            });
            newData.save();
            res.status(201).send(newData);
        } 
        catch(error) 
        {
            res.status(404).type("text/plain").send(error);
        }
    });

    app.get("/adminevent/:id", authAdmin, async (req, res) =>
    {
        const eventID = req.params.id;
        try 
        { 
            Data.findOne({ EventID: eventID})
            .then((data)=>
            {
                res.status(200).send(data);
            })
            .catch((error)=>
            {
                res.status(404).type("text/plain").send(error);
            })
        } 
        catch(error) 
        {
            res.status(404).type("text/plain").send(error);
        }
    });

    app.put("/adminevent", authAdmin, async (req, res) =>
    {
        const {eventID, eventTitle, eventLocation, eventDate, eventTime, eventDescription, eventPresenter, eventPrice} = req.body;
        try 
        { 
            Data.updateMany( {EventID: eventID,}, {$set:{Title: eventTitle, Venue: eventLocation,Date: eventDate,Time: eventTime,Description: eventDescription,Presenter: eventPresenter,Price: eventPrice}})
            .then((data)=>
            {
                res.status(200).send(data);
            })
            .catch((error)=>
            {
                res.status(404).type("text/plain").send(error);
            })
        } 
        catch(error) 
        {
            res.status(404).type("text/plain").send(error);
        }
    });

    app.delete("/adminevent/:id", authAdmin, async (req, res) =>
    {
        const eventID = req.params.id;
        try 
        { 
            Data.deleteOne({EventID: eventID})
            .catch((error)=>
            {
                res.status(404).type("text/plain").send(error);
            })
            res.status(200).send("Deleted");
        } 
        catch(error) 
        {
            res.status(404).type("text/plain").send(error);
        }
    });
	
	app.delete('/user/:username', authAdmin, async (req, res) => {
		const {
            username
        } = req.params;
        try {
			const user = await User.findOneAndDelete({
                username
            });
            if (!user) {
                res.set('Content-Type', 'text/plain').status(404).send('noUser');
                return;
            }
			return res.set('Content-Type', 'text/plain').status(204).send('success');
        } catch (error) {
            console.log(error);
			res.set('Content-Type', 'text/plain').status(500).send('Internal Server Error');
        }
    });
	app.get("*", (req, res) => {
	const content = renderToString(
		<StaticRouter location={req.path}>
		<RoutesDef />
		</StaticRouter>
	);

	fs.readFile(path.resolve("./public/route.html"), "utf8", (err, data) => {
    if (err) {
        console.error(err);
        return res.set('Content-Type', 'text/plain').status(500).send("Internal Server Error");
    }
    return res.send(data);
    });

});
});



app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
