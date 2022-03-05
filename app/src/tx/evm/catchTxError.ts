import { catchError, OperatorFunction } from 'rxjs';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';

interface CatchTxErrorParams {
  txErrorReporter?: (error: unknown) => string;
}

const catchTxError = <TxResult>(
  params: CatchTxErrorParams,
): OperatorFunction<TxResultRendering<TxResult>, any> => {
  const { txErrorReporter } = params;

  return catchError((error) => {
    const errorId = txErrorReporter ? txErrorReporter(error) : error.message;

    if (
      error.data.message.includes(
        'execution reverted: transfer info already processed',
      )
    ) {
      return Promise.resolve<TxResultRendering>({
        value: null,
        phase: TxStreamPhase.SUCCEED,
        receipts: [],
      });
    }

    return Promise.resolve<TxResultRendering>({
      value: null,
      phase: TxStreamPhase.FAILED,
      failedReason: { error: error.data.message, errorId },
      receipts: [],
    });
  });
};

export { catchTxError };
