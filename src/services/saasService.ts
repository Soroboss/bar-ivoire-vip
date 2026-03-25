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
