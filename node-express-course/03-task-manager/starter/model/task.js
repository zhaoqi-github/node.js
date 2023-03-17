const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // could be true/false or [true, 'must provide name']
    trim: true,
    maxLength: [20, 'name can not be more than 20 characters'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Task', TaskSchema);
/* The first argument is the singular name of the collection your model is for. 
Mongoose automatically looks for the plural, lowercased version of your model name. 
Thus, for the example above, the model Tank is for the tanks collection in the database.
 */
