import { useCoreContext } from '../../core/Context/CoreProvider';
import { h } from 'preact';
import { useIsMobile } from '../../utils/useIsMobile';
import Timeline from '../internal/Timeline';
import './Instructions.scss';

export default function Instructions() {
    const { i18n } = useCoreContext();
    const { isMobileScreenSize } = useIsMobile();

    if (isMobileScreenSize) {
        return null;
    }

    const instructions = i18n.get('payme.instructions.steps').split('%@');

    return (
        <div className="adyen-checkout-payme-instructions">
            <Timeline instructions={instructions} />
        </div>
    );
}
