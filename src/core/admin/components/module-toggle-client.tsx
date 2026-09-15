"use client";

import {toggleModuleStateAction} from '@/core/admin/lib/module-actions';
import {ModuleDefinition, SystemModuleKey} from '@/shared/constants/modules';
import formStyle from '@/shared/styles/form.module.css';
import panelStyle from '@/shared/styles/panel.module.css';
import {useState, useTransition} from 'react';

interface ModuleToggleClientProps {
    initialStates: Record<SystemModuleKey, boolean>;
    modulesMetadata: Record<SystemModuleKey, ModuleDefinition>;
}

export function ModuleToggleClient({
                                       initialStates,
                                       modulesMetadata,
                                   }: ModuleToggleClientProps) {
    const [states, setStates] = useState<Record<SystemModuleKey, boolean>>(initialStates);
    const [isPending, startTransition] = useTransition();

    const handleToggle = (key: SystemModuleKey) => {
        const nextState = !states[key];

        // Optimistic UI update
        setStates((prev) => ({...prev, [key]: nextState}));

        startTransition(async () => {
            const result = await toggleModuleStateAction(key, nextState);
            if (!result.success) {
                // Rollback on failure
                setStates((prev) => ({...prev, [key]: !nextState}));
                alert(result.error ?? 'Failed to update module state');
            }
        });
    };

    const categories = Array.from(
        new Set(Object.values(modulesMetadata).map((m) => m.category))
    );

    return (
        <div className={panelStyle.section}>
            {categories.map((category) => {
                const categoryModules = Object.values(modulesMetadata).filter(
                    (m) => m.category === category
                );

                return (
                    <div key={category} className={panelStyle.group}>
                        <h2 className={panelStyle.title}>{category} Modules</h2>
                        <div className={panelStyle.grid}>
                            {categoryModules.map((module) => {
                                const isEnabled = states[module.key] ?? module.defaultEnabled;

                                return (
                                    <div key={module.key}
                                         className={`${panelStyle.card} ${
                                             isEnabled ? panelStyle.active : panelStyle.disabled
                                         }`}>
                                        <div className={panelStyle.cardHeader}>
                                            <div>
                                                <h3>{module.name}</h3>
                                                <p>{module.description}</p>
                                            </div>
                                            <span className={`${panelStyle.badge} 
                                                ${isEnabled ? panelStyle.activeBadge : panelStyle.disabledBadge}`}>
                                            {isEnabled ? 'Active' : 'Disabled'}
                                          </span>
                                        </div>

                                        <div className={panelStyle.cardFooter}>
                                            <label className={formStyle.label}>
                                                <input type="checkbox"
                                                       checked={isEnabled}
                                                       disabled={isPending}
                                                       onChange={() => handleToggle(module.key)}
                                                       className={formStyle.checkbox}/>
                                                <span>{isEnabled ? 'Enabled' : 'Disabled'}</span>
                                            </label>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
