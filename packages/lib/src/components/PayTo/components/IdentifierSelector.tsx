import { h } from 'preact';
import Select from '../../internal/FormFields/Select';
import { SelectTargetObject } from '../../internal/FormFields/Select/types';
import Field from '../../internal/FormFields/Field';
import { useCoreContext } from '../../../core/Context/CoreProvider';
import Language from '../../../language';
import { createEnumChecker } from '../../../core/utils';

export enum PayToIdentifierEnum {
    phone = 'phone',
    email = 'email',
    abn = 'abn',
    orgid = 'orgid'
}

const payToIdentifierEnumCheck = createEnumChecker(PayToIdentifierEnum);

export type PayToPayIDInputIdentifierValues = keyof typeof PayToIdentifierEnum;

type PayIdOptionsType = { id: PayToPayIDInputIdentifierValues; nameKey: string }[];

export const PAYID_IDENTIFIER_OPTIONS: PayIdOptionsType = [
    {
        id: PayToIdentifierEnum.phone,
        nameKey: 'payto.payid.option.phone'
    },
    {
        id: PayToIdentifierEnum.email,
        nameKey: 'payto.payid.option.email'
    },
    {
        id: PayToIdentifierEnum.abn,
        nameKey: 'payto.payid.option.abn'
    },
    {
        id: PayToIdentifierEnum.orgid,
        nameKey: 'payto.payid.option.orgid'
    }
];

interface IdentifierSelectorProps {
    selectedIdentifier: PayToPayIDInputIdentifierValues;
    onSelectedIdentifier: (value: PayToPayIDInputIdentifierValues) => void;
}

const loadI18nForOptions = (i18n: Language, options: PayIdOptionsType) =>
    options.map(option => ({
        id: option.id,
        name: i18n.get(option.nameKey)
    }));

export default function IdentifierSelector({ selectedIdentifier, onSelectedIdentifier }: IdentifierSelectorProps) {
    const { i18n } = useCoreContext();

    const hydratedOptions = loadI18nForOptions(i18n, PAYID_IDENTIFIER_OPTIONS);

    // TODO this probably can by a bit tidier, clean up some of these types
    //   maybe make Select type generic
    const onChange = (e: { target: SelectTargetObject }) => {
        // TODO clean this
        const valueStr = e.target.value + '';

        if (payToIdentifierEnumCheck(valueStr)) {
            onSelectedIdentifier(valueStr);
        }
    };

    return (
        <Field
            className={''}
            name={'payid-identifier'}
            useLabelElement={true}
            label={i18n.get('payto.payid.label.identifier')}
            showContextualElement={false}
        >
            <Select filterable={false} items={hydratedOptions} selectedValue={selectedIdentifier} onChange={onChange} name={'payid-identifier'} />
        </Field>
    );
}
