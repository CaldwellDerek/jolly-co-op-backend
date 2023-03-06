const User = require("./User");
const Group = require("./Group");
const Game = require("./Game")
const Nomination = require("./Nomination")
const Vote = require('./Vote')

User.hasMany(Game,{
    onDelete:"CASCADE"
});

User.belongsToMany(Group,{
    through:'UserGroup',
    onDelete:"CASCADE"
});

User.belongsTo(Group,{
    throught:'Owner'
})

User.hasMany(Nomination,{
})

User.hasMany(Vote,{
})

Group.hasOne(User,{
    through:'Owner'
})

Group.belongsToMany(User,{
    through:'UserGroup'
});

Group.hasMany(Game,{
});

Group.hasMany(Nomination,{
});

Game.hasMany(Nomination,{
});

Nomination.belongsTo(User,{
});

Nomination.belongsTo(Group,{
});

Nomination.belongsTo(Game,{
});

Nomination.hasMany(Vote,{
})

Vote.belongsTo(User,{
})

Vote.belongsTo(Nomination,{
})

module.exports={
    User,
    Group,
    Game,
    Vote,
    Nomination
}