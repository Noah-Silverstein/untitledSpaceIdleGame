

export class IDGen {
    private existingIDs: Set<string>;
  
    constructor(initialIDs?: Iterable<string>) {
      // Initialize the set with existing IDs if provided
      this.existingIDs = new Set(initialIDs || []);
    }
  
    /**
     * Generates a new unique ID.
     * @returns {string} A unique ID that is not already in use.
     */
    generateID(): string {
      let newID: string;
      do {      //do while loop
        newID = this.createRandomID();
      } while (this.existingIDs.has(newID));    //exit if false
  
      this.existingIDs.add(newID);
      return newID;
    }
  
    /**
     * Checks if an ID exists in the set.
     * @param id The ID to check.
     * @returns {boolean} True if the ID exists, false otherwise.
     */
    hasID(id: string): boolean {
      return this.existingIDs.has(id);
    }
  
    /**
     * Adds an ID to the set of existing IDs.
     * @param id The ID to add.
     */
    addID(id: string): void {
      this.existingIDs.add(id);
    }
  
    /**
     * Removes an ID from the set of existing IDs.
     * @param id The ID to remove.
     */
    removeID(id: string): void {
      this.existingIDs.delete(id);
    }
  
    /**
     * Generates a random ID string.
     * @private
     * @returns {string} A random string suitable for an ID.
     */
    private createRandomID(): string {
      // Creates a simple random alphanumeric ID
      return Math.random().toString(36).slice(2, 9); // Generates a random string of length 9
    }
  }