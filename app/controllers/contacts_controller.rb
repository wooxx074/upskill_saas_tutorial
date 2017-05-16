class ContactsController < ApplicationController
  def new
    @contact = Contact.new
  end
  
  def create
    @contact = Contact.new
    if @contact.save
      redirect_to new_contact_path, notice: "Message sent."
    else
      redirect_to new_contact_path, notice: "Error occured, please try at a later time."
    end
  end
  
  private
    def contact_param
      params.require(:contact).permit(:name, :email, :comments)
    end
end