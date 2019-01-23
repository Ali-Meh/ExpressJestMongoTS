import '../Config/Config.ts';
import mongoose from 'mongoose';



beforeEach(function(done) {
    function clearDB() {
      for (var i in mongoose.connection.collections) {
        mongoose.connection.collections[i].remove(function() {});
      }
      return done();
    }
    if (mongoose.connection.readyState === 0) {
        mongoose.connect(process.env.DBUrl||"",{ useNewUrlParser: true }).then(()=>{
            return clearDB();
        }).catch((reason)=>{
            console.log(reason)
        });
    } else {
      return clearDB();
    }
  });

afterEach(function(done) {
    mongoose.disconnect();
    return done();
});
  
afterAll(done => {
    return done();
});