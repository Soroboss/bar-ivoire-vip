import { insforge } from '@/lib/insforge'
import { Plan, UserSubscription } from '@/types'

export const saasService = {
  // --- PLANS MANAGEMENT (SaaS Admin) ---
  
  async getPlans() {
    const { data, error } = await insforge.database
      .from('saas_plans')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (error) throw error
    return data as Plan[]
  },

  async updatePlan(planId: string, updates: Partial<Plan>) {
    const { data, error } = await insforge.database
      .from('saas_plans')
      .update(updates)
      .eq('id', planId)
      .select()
      .single()
    
    if (error) throw error
    return data as Plan
  },

  // --- SUBSCRIPTIONS MANAGEMENT ---

  async getSubscriptions() {
    const { data, error } = await insforge.database
      .from('subscriptions')
      .select('*, saas_plans(*), establishments(*)')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as UserSubscription[]
  },

  async validatePartnerSubscription(subscriptionId: string, plan: Plan) {
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + plan.trial_days)

    const { data, error } = await insforge.database
      .from('subscriptions')
      .update({
        plan_id: plan.id,
        plan: plan.slug,
        status: 'trial',
        active: true,
        trial_started_at: new Date().toISOString(),
        expires_at: trialEndsAt.toISOString()
      })
      .eq('id', subscriptionId)
      .select()
      .single()
    
    if (error) throw error
    
    // Also update establishment plan status
    if (data.establishment_id) {
       await insforge.database
         .from('establishments')
         .update({ 
           plan: plan.name,
           status: 'Active',
           trial_ends_at: trialEndsAt.toISOString()
         })
         .eq('id', data.establishment_id)
    }

    return data as UserSubscription
  },

  async activateEstablishment(establishmentId: string, planSlug: string) {
    // 1. Get plan details
    const { data: plan, error: planError } = await insforge.database
      .from('saas_plans')
      .select('*')
      .eq('slug', planSlug)
      .maybeSingle()
    
    if (planError || !plan) throw new Error(`Plan ${planSlug} introuvable`)

    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + (plan.trial_days || 7))

    // 2. Create subscription record
    const { data: sub, error: subError } = await insforge.database
      .from('subscriptions')
      .insert([{
        establishment_id: establishmentId,
        plan_id: plan.id,
        plan: plan.name,
        status: 'trial',
        active: true,
        trial_started_at: new Date().toISOString(),
        expires_at: trialEndsAt.toISOString()
      }])
      .select()
      .single()
    
    if (subError) throw subError

    // 3. Update establishment status & plan
    const { error: estError } = await insforge.database
      .from('establishments')
      .update({ 
        status: 'Active',
        plan: plan.name,
        trial_ends_at: trialEndsAt.toISOString()
      })
      .eq('id', establishmentId)
    
    if (estError) throw estError

    // 4. Log initial SaaS transaction
    await insforge.database
      .from('saas_transactions')
      .insert([{
        establishment_id: establishmentId,
        amount: 0,
        plan: plan.name,
        status: 'success'
      }])

    return sub as UserSubscription
  },

  async applyDiscount(subscriptionId: string, discount: { amount?: number, percent?: number, reason: string }) {
    const { data, error } = await insforge.database
      .from('subscriptions')
      .update({
        discount_amount: discount.amount || 0,
        discount_percent: discount.percent || 0,
        discount_reason: discount.reason
      })
      .eq('id', subscriptionId)
      .select()
      .single()
    
    if (error) throw error
    return data as UserSubscription
  },

  async updateSubscriptionStatus(subscriptionId: string, status: UserSubscription['status'], active: boolean) {
    const { error } = await insforge.database
      .from('subscriptions')
      .update({ status, active })
      .eq('id', subscriptionId)
    
    if (error) throw error
    return true
  }
}
