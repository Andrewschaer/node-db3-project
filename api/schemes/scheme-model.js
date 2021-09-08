const db = require('../../data/db-config');

async function find() {
  const result = await db('schemes as sc')
    .leftJoin('steps as st','sc.scheme_id','st.scheme_id')
    .select('sc.scheme_id','sc.scheme_name')
    .count('st.step_id as number_of_steps')
    .groupBy('sc.scheme_id')
    .orderBy('sc.scheme_id', 'asc');
  return result;
}

async function findById(scheme_id) {
  const possibleScheme = await db('schemes').where('scheme_id', scheme_id).first();
  if (possibleScheme === undefined) {
    return possibleScheme
  } else {
    const initialArray = await db('schemes as sc')
      .leftJoin('steps as st','sc.scheme_id','st.scheme_id')
      .select('st.step_id','st.step_number','st.instructions','sc.scheme_name', 'sc.scheme_id')
      .where('sc.scheme_id', scheme_id)
      .orderBy('st.step_number', 'asc');
     if (initialArray[0].step_number === null) {
      const result = {
        scheme_id: initialArray[0].scheme_id,
        scheme_name: initialArray[0].scheme_name,
        steps: []
      };
      return result;
    } else {
      const result = {
        scheme_id: initialArray[0].scheme_id,
        scheme_name: initialArray[0].scheme_name,
        steps: initialArray.map(obj => ({
          step_id: obj.step_id,
          step_number: obj.step_number,
          instructions: obj.instructions
        }))
      }; 
      return result;
    }
  }
}

async function findSteps(scheme_id) {
  const possibleScheme = await db('schemes').where('scheme_id', scheme_id).first();
  if (possibleScheme === undefined) {
    return possibleScheme
  } else {
    const result = await db('schemes as sc')
      .leftJoin('steps as st','sc.scheme_id','st.scheme_id')
      .select('st.step_id','st.step_number','st.instructions','sc.scheme_name')
      .where('sc.scheme_id', scheme_id)
      .orderBy('st.step_number', 'asc');
    if (result[0].step_number === null) {
      const emptyResult = [];
      return emptyResult;
    } else { 
      return result;
    }
  }
}

async function add(scheme) {
  const [scheme_id] = await db('schemes').insert(scheme);
  const initialResult = await findById(scheme_id);
  const result = {
    scheme_id: initialResult.scheme_id,
    scheme_name: initialResult.scheme_name
  };
  return result
}

async function addStep(scheme_id, step) {
  const possibleScheme = await db('schemes').where('scheme_id', scheme_id).first();
  if (possibleScheme === undefined) {
    return possibleScheme
  } else {
    await db('steps').insert({
      ...step, scheme_id
    }); 
    return findSteps(scheme_id);
  }
  
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
    // response:
    // [
    //   {
    //     "step_id": 12,
    //     "step_number": 1,
    //     "instructions": "quest and quest some more",
    //     "scheme_name": "Find the Holy Grail"
    //   },
    //   {
    //     "step_id": 17,
    //     "step_number": 2,
    //     "instructions": "and yet more questing",
    //     "scheme_name": "Find the Holy Grail"
    //   }
    // ]
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
