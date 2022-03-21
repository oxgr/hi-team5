/**
This class includes information on all the objects in the world. This includes an array of agents as well as an array of objects in the environment.
*/
class World {
  
  constructor() {
    
    this.agents = [];
    this.environment = [];
    
  }
  
  /**
    *  Adds an agent to the local world. A separate object gets the raw values and assigns them to properties. This method is preferred since it makes a deep copy isntead of a shallow copy.

    This method creates two p5.Vector objects from the xy values. This is done to utilise the utility methods in the p5.Vector class.
    *
    * @param Object data A packet of data received from the server. Contains a color to id the agent and x, y properties.
    */
  addAgent( data ) {

    // If data is already an Agent object, no need to create a new one.
    if ( data instanceof Agent ) {
      this.agents.push( data );
    } else {
      this.agents.push( new Agent( data.x, data.y, data.color) );  
    }
    
    console.log( '[WORLD]: Agent %s added!', data.color );

  }
  
  /**
    *  Removes an agent from the local world.
    *
    * @param Object data A packet of data received from the server. 
    *
    */
  removeAgent( data ) {
    
    const index = this.agents.findIndex( ( agent ) => agent.color == data.color )
  
    // If found, splice() removes the element in the array at the given index.
    if ( index > -1 ) { 
      
      this.agents.splice( index, 1 );
      console.log('[WORLD]: Agent %s removed!', data.color );
      
    } else {
      
      console.log('[WORLD]: Tried to remove, but no agent found.', data.color );
      
    } 
    
  }
  
  /**
  *  Fills the world with all the agents in the <newWorld> array. This is ideally retrieved from the server after a getWorld socket.emit.
  *
  * @param Array newWorld An array of objects containing all the agents in the world.
  */
  addAgentsFromWorld( newWorld ) {

    for ( let data of newWorld ) {
      // if ( data.color != localAgent.color )
        this.addAgent( data );
    }

  }
  
  /**
  * Finds an agent and updates it
  */
  updateAgent( data ) {
    
    const agent = this.findAgent( data );
    
    agent.updateTarget( data );
    
  }
  
  findAgent( data ) {

    const agentInWorld = this.agents.find( ( agent ) => agent.color == data.color );
    
    // If the agentInWorld is not undefined i.e. it exists...
    if ( agentInWorld ) { 
      
      return agentInWorld;
      
    } else {
      
      this.addAgent( data );
      return this.findAgent( data );
      
    } 

  }
  
  /**
  *  Updates the state of the environment;
  */
  updateEnvironment() {
    
    
    
  }
  
  /** 
  * Draws all the elements in the background! be sure to create a method to add the background objects to the this.environment array.
  */
  showEnvironment() {
    
    
    
  }
   
}