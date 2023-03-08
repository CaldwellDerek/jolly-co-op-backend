
const array =[1,2,3,4]
const groupMembers = array.map(member => {
    return {
     GroupId: member,
     UserId: member
   }})
 console.log(groupMembers)