import { useCoreContext } from '../../../core/Context/CoreProvider';
import Timeline from '../../internal/Timeline';
import { Fragment, h } from 'preact';
import { useIsMobile } from '../../../utils/useIsMobile';

import './PayMeIntroduction.scss';

const PayMeIntroduction = () => {
    const { i18n } = useCoreContext();
    const { isMobileScreenSize } = useIsMobile();

    if (isMobileScreenSize) {
        const instructions = i18n.get('payme.instructions.steps').split('%@');

        return (
            <div className="adyen-checkout-payme-instroduction">
                <Timeline instructions={instructions} />
            </div>
        );
    }

    return <Fragment>{i18n.get('payme.scanQrCode')}</Fragment>;
};

export { PayMeIntroduction };
