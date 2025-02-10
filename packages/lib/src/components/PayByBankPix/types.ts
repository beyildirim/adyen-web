import { TxVariants } from '../tx-variants';
import { PayByBankPixProps } from './components/PayByBankPix/types';

export type RiskSignals = {
    isRootedDevice?: boolean;
    screenBrightness?: number;
    elapsedTimeSinceBoot?: number;
    osVersion?: string;
    userTimeZoneOffset?: number;
    language?: string;
    screenDimensions?: { width?: number; height?: number };
};

export type PayByBankPixConfiguration = Omit<Partial<PayByBankPixProps>, 'txVariant'> & {
    /**
     * Risk related information, optionally pass may increase the conversion rate
     * todo: check with sarah for the complete list
     */
    riskSignals?: RiskSignals;
    deviceId?: string;
    /**
     * @internal
     */
    _isNativeFlow?: boolean;
};

export interface PayByBankPixData {
    paymentMethod: {
        type: TxVariants.paybybank_pix;
        subType: 'redirect' | 'embedded';
        riskSignals?: RiskSignals;
    };
    returnUrl?: string; // todo:remove it testing purpose
}
