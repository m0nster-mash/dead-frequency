import {ModuleToggleClient} from '@/core/admin/components/module-toggle-client';
import {getModuleStatesAction} from '@/core/admin/lib/module-actions';
import {MainContentPanel} from "@/core/dashboard/components/panels/main-card";
import {PageHeader} from "@/core/dashboard/components/panels/page-header";
import {SYSTEM_MODULES_METADATA} from '@/shared/constants/modules';

interface AdminModulesPageProps {
    params: Promise<Record<string, string>>;
}

/**
 * Next.js 15 Admin Module Control Panel (Server Component)
 */
export default async function AdminModulesPage({params}: AdminModulesPageProps) {
    // Respecting Next.js 15 async params standard
    await params;

    const initialStates = await getModuleStatesAction();

    return (
        <>
            <PageHeader eyebrow={"Admin Tools"}
                        title={"System Module Controls"}
                        subtitle={"Enable or disable standalone features across Dead Frequency."}/>

            <MainContentPanel title={"Module Control"}>
                <ModuleToggleClient initialStates={initialStates}
                                    modulesMetadata={SYSTEM_MODULES_METADATA}/>
            </MainContentPanel>
        </>
    );
}
