import { All, Rule, Required, Object, MandatoryFields, String } from "paradise";

export const BuildRule: Rule = All([
    Required(),
    Object(),
    MandatoryFields({
        push: [ Required(), Object() ],
        repository: [ Required(), Object(), MandatoryFields({
            full_name: [ Required(), String() ]
        })]
    })
]);
