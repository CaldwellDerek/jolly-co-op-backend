const User = require("./User");
const Group = require("./Group");
const Game = require("./Game")
const Nomination = require("./Nomination")
const Vote = require('./Vote')
const Usergroup = require('./Usergroup')
const Usergame = require('./Usergame')
const Gamegroup = require('./Gamegroup')

User.belongsToMany(Game,{
    through:Usergame,
    onDelete:"CASCADE"
});

User.belongsToMany(Group,{
    through:Usergroup,
    onDelete:"CASCADE",
});

User.hasMany(Vote,{
    onDelete:"CASCADE"
})

// User.hasMany(Group,{
// })

Group.belongsTo(User,{
    as:'Owner'
})

Group.belongsToMany(User,{
    through:Usergroup
});


Group.belongsToMany(Game,{
    through:Gamegroup
});

Group.hasMany(Vote,{
    onDelete:"CASCADE"
})

// Group.hasMany(Nomination,{
// });

Game.belongsToMany(User,{
    through:Usergame,
});


Game.belongsToMany(Group,{
    through:Gamegroup,
});

Game.hasMany(Vote,{
    onDelete:"CASCADE"
})

Vote.belongsTo(User,{
})

Vote.belongsTo(Group,{
})

Vote.belongsTo(Game,{
})

module.exports={
    User,
    Group,
    Game,
    Vote,
    Usergroup,
    Usergame
}