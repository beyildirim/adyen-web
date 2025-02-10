import { h } from 'preact';
import { PayButtonFunctionProps } from '../../../internal/UIElement/types';
import { IssuerItem } from '../../../internal/IssuerList/types';
import { OnChangeData } from '../../../../core/types';
import { SendAnalyticsObject } from '../../../../core/Analytics/types';

interface BaseEnrollmentProps {
    type?: string;
    showPayButton: boolean;

    payButton(props: PayButtonFunctionProps): h.JSX.Element;

    /**
     * @internal
     */
    onSubmitAnalytics?: (aObj: SendAnalyticsObject) => void;

    onChange?(payload: OnChangeData): void;

    ref: any;
}

export interface AwaitProps extends BaseEnrollmentProps {
    type: 'await';
    clientKey: string;
    enrollmentId: string;
    paymentMethodType?: string;
    countdownTime?: number;
}

export interface IssuerListProps extends BaseEnrollmentProps {
    txVariant: string;
    issuers?: IssuerItem[];
}

export type EnrollmentProps = AwaitProps | IssuerListProps;

export interface IEnrollment {
    showValidation: () => {};
}
