import { SignerOptions } from '@polkadot/api/submittable/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { Logger } from '@/intiv/utils/Utility';
import { Inject } from '@/intiv/utils/ObjectManager';
import colors from 'colors';


export default class TransactionHandler
{
    
    @Inject({ ctorArgs: [ 'PolkadotTransactionHandler' ] })
    protected logger : Logger;
    
    
    public async handleApiRequest (
        transaction : SubmittableExtrinsic<any>,
        keyringPair : KeyringPair,
        transactionId : string,
        options? : Partial<SignerOptions>
    ) : Promise<void>
    {
        return new Promise<void>(async(resolve, reject) => {
            const unsub : any = await transaction
                .signAndSend(keyringPair, options, ({ status }) => {
                    if (status.isReady) {
                        this.logger.log(transactionId + ': ' + colors.grey('ready'));
                    }
                    else if (status.isBroadcast) {
                        this.logger.log(transactionId + ': ' + colors.grey('brodcast'));
                    }
                    else if (status.isInvalid) {
                        this.logger.log(transactionId + ': ' + colors.red('invalid'));
                        reject();
                    }
                    else if (status.isDropped) {
                        this.logger.log(transactionId + ': ' + colors.red('dropped'));
                        reject();
                    }
                    else if (status.isRetracted) {
                        this.logger.log(transactionId + ': ' + colors.red('retracted'));
                        reject();
                    }
                    else if (status.isInBlock) {
                        this.logger.log(transactionId + ': ' + colors.green('in block'));
                        resolve();
                    }
                    
                    if (status.isFinalized || status.isFinalityTimeout) {
                        resolve();
                        unsub();
                    }
                });
        });
    }
    
}
