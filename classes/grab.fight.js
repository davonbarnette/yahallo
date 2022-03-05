const GRAB_FIGHT_STATUS = {
    IN_PROGRESS: "IN_PROGRESS",
    ENDING: "ENDING",
    COMPLETED: "COMPLETED",
}

class GrabFight {

    status;
    users;
    printId;
    discordReply;
    timeoutFn;
    grabFightTimeToExpire;

    curTimeout;

    constructor(
        printId,
        timeoutFn = () => null,
        grabFightTimeToExpire = 5,
        status = GRAB_FIGHT_STATUS.IN_PROGRESS,
        users = [],
        discordReply,
    ){
        this.printId = printId;
        this.status = status;
        this.users = users;
        this.discordReply = discordReply;
        this.timeoutFn = timeoutFn;
        this.grabFightTimeToExpire = grabFightTimeToExpire;
    }

    setTimeout(){
        if (this.curTimeout){
            clearTimeout(this.curTimeout);
        }
        this.curTimeout = setTimeout(this.timeoutFn, this.grabFightTimeToExpire);
    }
}


module.exports = {GrabFight, GRAB_FIGHT_STATUS};