import {
  Contract,
  SorobanRpc,
  TransactionBuilder,
  BASE_FEE,
  nativeToScVal,
  Address,
  xdr,
} from '@stellar/stellar-sdk';
import { SOROBAN_RPC_URL, STREAM_CONTRACT_ID, NETWORK_PASSPHRASE } from './constants';

const server = new SorobanRpc.Server(SOROBAN_RPC_URL);

type SignFn = (xdr: string) => Promise<string>;

async function invoke(method: string, args: xdr.ScVal[], source: string, sign: SignFn) {
  const contract = new Contract(STREAM_CONTRACT_ID);
  const account = await server.getAccount(source);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(sim)) {
    throw new Error(sim.error);
  }

  const assembled = SorobanRpc.assembleTransaction(tx, sim).build();
  const signedXdr = await sign(assembled.toXDR());
  const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);

  const result = await server.sendTransaction(signedTx);
  if (result.status === 'ERROR') throw new Error('Transaction failed');
  return result;
}

export const contract = {
  createStream: (
    sender: string,
    recipient: string,
    token: string,
    deposit: bigint,
    ratePerSecond: bigint,
    duration: bigint,
    cliffTime: bigint,
    title: string,
    sign: SignFn,
  ) =>
    invoke(
      'create_stream',
      [
        Address.fromString(sender).toScVal(),
        Address.fromString(recipient).toScVal(),
        Address.fromString(token).toScVal(),
        nativeToScVal(deposit, { type: 'i128' }),
        nativeToScVal(ratePerSecond, { type: 'i128' }),
        nativeToScVal(duration, { type: 'u64' }),
        nativeToScVal(cliffTime, { type: 'u64' }),
        nativeToScVal(title || '', { type: 'string' }),
      ],
      sender,
      sign,
    ),

  withdraw: (streamId: bigint, recipient: string, sign: SignFn) =>
    invoke(
      'withdraw',
      [
        nativeToScVal(streamId, { type: 'u64' }),
        Address.fromString(recipient).toScVal(),
      ],
      recipient,
      sign,
    ),

  depositMore: (streamId: bigint, amount: bigint, sender: string, sign: SignFn) =>
    invoke(
      'deposit_more',
      [
        nativeToScVal(streamId, { type: 'u64' }),
        Address.fromString(sender).toScVal(),
        nativeToScVal(amount, { type: 'i128' }),
      ],
      sender,
      sign,
    ),

  transferRecipient: (
    streamId: bigint,
    newRecipient: string,
    currentRecipient: string,
    sign: SignFn,
  ) =>
    invoke(
      'transfer_recipient',
      [
        nativeToScVal(streamId, { type: 'u64' }),
        Address.fromString(currentRecipient).toScVal(),
        Address.fromString(newRecipient).toScVal(),
      ],
      currentRecipient,
      sign,
    ),

  cancelStream: (streamId: bigint, sender: string, sign: SignFn) =>
    invoke(
      'cancel_stream',
      [nativeToScVal(streamId, { type: 'u64' }), Address.fromString(sender).toScVal()],
      sender,
      sign,
    ),

  pauseStream: (streamId: bigint, sender: string, sign: SignFn) =>
    invoke(
      'pause_stream',
      [nativeToScVal(streamId, { type: 'u64' }), Address.fromString(sender).toScVal()],
      sender,
      sign,
    ),

  resumeStream: (streamId: bigint, sender: string, sign: SignFn) =>
    invoke(
      'resume_stream',
      [nativeToScVal(streamId, { type: 'u64' }), Address.fromString(sender).toScVal()],
      sender,
      sign,
    ),
};
