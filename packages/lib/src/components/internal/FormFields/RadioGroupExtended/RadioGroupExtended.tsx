import { h } from 'preact';
import cx from 'classnames';
import './RadioGroup.scss';
import { RadioGroupProps } from './types';
import { getUniqueId } from '../../../../utils/idGenerator';
import { useCoreContext } from '../../../../core/Context/CoreProvider';
import DualBrandingIcon from '../../../Card/components/CardInput/components/DualBrandingIcon/DualBrandingIcon';
import RadioButtonIcon from './RadioButtonIcon';
import { getCardImageUrl } from '../../../Card/components/CardInput/utils';

export default function RadioGroupExtended(props: RadioGroupProps) {
    const { items, name, onChange, value, isInvalid, uniqueId, ariaLabel, style = 'classic' } = props;

    const { i18n } = useCoreContext();
    const uniqueIdBase = uniqueId?.replace(/[0-9]/g, '').substring(0, uniqueId.lastIndexOf('-'));

    return (
        <div
            className={cx(['adyen-checkout__radio_group', `adyen-checkout__radio_group--${style}`])}
            role={'radiogroup'}
            {...(ariaLabel && { ['aria-label']: ariaLabel })}
        >
            {items.map(item => {
                const uniqueId = getUniqueId(uniqueIdBase);
                return (
                    <div key={item.id} className="adyen-checkout__radio_group__input-wrapper">
                        <input
                            id={uniqueId}
                            type="radio"
                            checked={value === item.id}
                            className="adyen-checkout__radio_group__input"
                            name={name}
                            onChange={onChange}
                            onClick={onChange}
                            value={item.id}
                        />
                        <label
                            className={cx([
                                'adyen-checkout__label__text',
                                'adyen-checkout__radio_group__label',
                                props.className,
                                { 'adyen-checkout__radio_group__label--invalid': isInvalid }
                            ])}
                            htmlFor={uniqueId}
                        >
                            <RadioButtonIcon
                                key={item.id}
                                brand={item.id}
                                brandsConfiguration={props.brandsConfiguration}
                                getImageURL={props.getImageURL}
                                getFullBrandName={props.getFullBrandName}
                                // onClick={dualBrandingChangeHandler}
                                // dataValue={item.id}
                                // notSelected={dualBrandingSelected !== '' && dualBrandingSelected !== item.id}
                            />
                            {i18n.get(item.name)}
                        </label>
                    </div>
                );
            })}
        </div>
    );
}

RadioGroupExtended.defaultProps = {
    onChange: () => {},
    items: []
};
