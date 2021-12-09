export type Transfer = {
    from : number,
    to : number,
    amount : number,
};

export type Account = {
    id : number,
    name : string,
    address : string,
    balanceTotal : number,
    balanceTransferable : number,
    balanceStaked : number,
    owner? : boolean,
};

export type StakePool = {
    id : number,
    onChainId : number,
    ownerId : number,
    stakers : {
        account : number,
        amount : number,
    }[],
    stakeTotal : number,
    stakeFree : number,
    stakeReleasing : number,
    v : number,
};

export enum NodeType
{
    Account = 'Account',
    StakePool = 'StakePool',
}

export enum AccountTag
{
    Internals = 'Internals',
    Team = 'Team',
    Exchange = 'Exchange',
    Owned = 'Owned',
}

export enum MenuAction
{
    Copy = 'Copy',
    OpenSubscan = 'OpenSubscan',
    LoadStakers = 'LoadStakers',
    LoadStakePools = 'LoadStakePools',
    LoadTransfers = 'LoadTransfers',
    LoadTransfersSent = 'LoadTransfersSent',
    LoadTransfersRecieved = 'LoadTransfersRecieved',
    Hide = 'Hide',
}

export const balanceTypes = [
    'balanceTransferable',
    'balanceStaked',
];

export const stakeTypes = [
    'stakeFree',
    'stakeReleasing',
];

export const colors = {
    nodeBorderAccount: '#000000',
    balanceTotal: '#cccccc',
    balanceTransferable: '#00ee00',
    balanceStaked: '#4cc4ff',
    
    nodeBorderStakePool: '#002288',
    stakeTotal: '#0c84bf',
    stakeFree: '#aa0000',
    stakeReleasing: '#5647d0',
    
    edgeOwner: '#FFB2AA',
    edgeStaker: '#7cadc5',
    edgeTransfer: '#A9CBA9',
    
    tagColor: {
        [AccountTag.Internals]: '#4cc4ff',
        [AccountTag.Team]: '#ff0000',
        [AccountTag.Exchange]: '#5647d0',
        [AccountTag.Owned]: '#009d00',
    }
};
